import Plugin from '../plugin';
import { NMPlayer } from '../types';

export class TemplatePlugin extends Plugin {
	player: NMPlayer = <NMPlayer>{};

	initialize(player: NMPlayer) {
		this.player = player;
		// Initialize the plugin with the player
	}

	use() {
		//
	}

	dispose() {
		//
	}
}
