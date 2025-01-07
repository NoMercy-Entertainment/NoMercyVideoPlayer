import type { NMPlayer } from './types';

class Plugin {
	player: NMPlayer = <NMPlayer>{};

	initialize(player: NMPlayer) {
		this.player = player;
		// This method should be overridden by subclasses
	}

	use() {
		// This method should be overridden by subclasses
	}
}

export default Plugin;
