import Plugin from '../plugin';
import { NMPlayer } from '../index';

export class TemplatePlugin extends Plugin {
	player: NMPlayer | null = null;

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
