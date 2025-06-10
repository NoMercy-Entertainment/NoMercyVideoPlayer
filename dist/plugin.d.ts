import type { NMPlayer } from './types';
interface PluginConfig {
}
declare class Plugin {
    player: NMPlayer<PluginConfig>;
    initialize(player: NMPlayer<PluginConfig>): void;
    use(): void;
    dispose(): void;
}
export default Plugin;
