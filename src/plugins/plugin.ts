import type { NMPlayer } from '../types';

class Plugin<T extends Record<string, any> = Record<string, any>> {
	/**
	 * Stable identifier for this plugin. Override in subclasses with a
	 * `static readonly id = 'your-plugin-name'` declaration.
	 *
	 * Using a static property instead of relying on `constructor.name` avoids
	 * breakage when the bundle is minified (mangled class names).
	 */
	static readonly id: string = 'plugin';

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
