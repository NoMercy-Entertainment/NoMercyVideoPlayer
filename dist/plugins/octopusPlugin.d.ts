import Plugin from '../plugin';
import type { NMPlayer } from '../types';
export interface OctopusPluginArgs {
    accessToken: string;
    debug: boolean;
    targetFps: number;
    blendRender: boolean;
    lazyFileLoading: boolean;
    renderAhead: boolean;
}
export declare class OctopusPlugin extends Plugin {
    player: NMPlayer<OctopusPluginArgs>;
    initialize(player: NMPlayer<OctopusPluginArgs>): void;
    use(): void;
    dispose(): void;
    destroy(): void;
    opus(): Promise<void>;
}
export default OctopusPlugin;
