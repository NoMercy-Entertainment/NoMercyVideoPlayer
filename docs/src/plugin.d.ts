import { NMPlayer } from './index.d';

declare class Plugin {
    player: NMPlayer;
    initialize(player: NMPlayer): void;
    use(): void;
}
export default Plugin;
