import Plugin from '../plugin';
import { NMPlayer } from '../index';

export class TVUIPlugin extends Plugin {
	player: any;

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
