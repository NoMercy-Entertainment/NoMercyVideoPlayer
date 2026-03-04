import Plugin from '../plugin';
import { NMPlayer } from '../types';

export class TemplatePlugin extends Plugin {
	declare player: NMPlayer<any>;

	initialize(player: NMPlayer<any>) {
		this.player = player;
	}

	use() {
		
	}

	dispose() {

	}
}

export default TemplatePlugin;