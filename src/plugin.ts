import type { NMPlayer } from './types';

interface PluginConfig {

}

class Plugin {
	player: NMPlayer<PluginConfig> = <NMPlayer<PluginConfig>>{};

	initialize(player: NMPlayer<PluginConfig>) {
		this.player = player;
	}

	use() {
		
	}

	dispose() {

	}
}

export default Plugin;
