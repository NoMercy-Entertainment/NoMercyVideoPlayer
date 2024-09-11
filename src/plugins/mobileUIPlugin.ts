import Plugin from '../Plugin';
import { NMPlayer } from '../index';

export class MobileUIPlugin extends Plugin {
	player: any;

	initialize(player: NMPlayer) {
		this.player = player;
		// Initialize the plugin with the player
	}

	use() {
		//
	}
}
