import Plugin from '../plugin';
import type { NMPlayer } from '../types';
export interface SabrePluginArgs {
    accessToken: string;
    debug: boolean;
}
export declare class SabrePlugin extends Plugin {
    player: NMPlayer<SabrePluginArgs>;
    frameCallbackHandle: number | null;
    initialize(player: NMPlayer<SabrePluginArgs>): void;
    use(): void;
    dispose(): void;
    destroy(): void;
    sabre(): Promise<void>;
}
declare global {
    interface Window {
        opentype: import('opentype.js/dist/opentype.min.js');
        sabre: sabre.SABRERenderer;
    }
}
export default SabrePlugin;
