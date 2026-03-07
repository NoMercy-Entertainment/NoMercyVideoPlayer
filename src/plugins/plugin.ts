import type { NMPlayer } from '../types';

class Plugin<T extends Record<string, any> = Record<string, any>> {
	declare player: NMPlayer<T>;

	initialize(player: NMPlayer<T>) {
		this.player = player;
	}

	use() {

	}

	dispose() {

	}
}

export default Plugin;
