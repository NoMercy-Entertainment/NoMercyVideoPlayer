import { default as Plugin } from '../plugin';
import { NMPlayer } from '../types';

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
        opentype: typeof import('opentype.js/dist/opentype.min.js');
        sabre: sabre.SABRERenderer;
    }
}
export default SabrePlugin;
