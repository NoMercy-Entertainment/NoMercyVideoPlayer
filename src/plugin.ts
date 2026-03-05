import type { NMPlayer } from './types';

class Plugin {
	declare player: NMPlayer<any>;

	initialize(player: NMPlayer<any>) {
		this.player = player;
	}

	use() {

	}

	dispose() {

	}
}

export default Plugin;
