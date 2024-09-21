import { default as Plugin } from '../plugin';
import { NMPlayer } from '../index';

export declare class SabrePlugin extends Plugin {
    player: NMPlayer;
    frameCallbackHandle: number | null;
    initialize(player: NMPlayer): void;
    use(): void;
    dispose(): void;
    destroy(): void;
    sabre(): Promise<void>;
}
declare global {
    interface Window {
        opentype: 'module:opentype.js';
        sabre: 'module:@sabre-js/sabre';
    }
}
export default SabrePlugin;
