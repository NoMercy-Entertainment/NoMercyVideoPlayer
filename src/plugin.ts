import type { NMPlayer } from './types';

interface PluginConfig {

}

class Plugin {
	player: NMPlayer<PluginConfig> = <NMPlayer<PluginConfig>>{};

	initialize(player: NMPlayer<PluginConfig>) {
		this.player = player;
		// Setup any necessary initial state or configuration here
	}

	use() {
		// Your plugin logic goes here
	}

	dispose() {
		// Clean up any resources or listeners here
	}
}

export default Plugin;
