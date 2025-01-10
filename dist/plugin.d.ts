import type { NMPlayer } from './types';
declare class Plugin {
    player: NMPlayer;
    initialize(player: NMPlayer): void;
    use(): void;
}
export default Plugin;
