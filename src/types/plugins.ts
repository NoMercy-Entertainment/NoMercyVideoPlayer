import type Plugin from '../plugins/plugin';
import type { PlayerConfig } from './config';
import type { NMPlayer } from './player';

export interface NMPlayerPlugins {
	/**
	 * Registers a plugin instance under the given ID and immediately initializes it
	 * by calling `plugin.initialize()`.
	 * @param id - A unique identifier for the plugin.
	 * @param plugin - The plugin instance to register.
	 */
	registerPlugin(id: string, plugin: Plugin): void;

	/**
	 * Activates a previously registered plugin by its ID.
	 * Calls the plugin's `use()` method. Logs an error if the plugin is not registered.
	 * @param id - The ID of the plugin to activate.
	 */
	usePlugin(id: string): void;

	/**
	 * Returns a registered plugin instance by name.
	 * @param name - The name the plugin was registered under.
	 * @returns The plugin instance, or `undefined` if not found.
	 */
	plugin(name: string): Plugin | undefined;

	/**
	 * Initializes the player with the given configuration options.
	 * Creates the video element, overlay, subtitle system, and loads the playlist.
	 * @param options - The player configuration options.
	 * @returns The initialized NMPlayer instance.
	 */
	setup<Conf extends Record<string, any> = Record<string, any>>(options: Partial<PlayerConfig<Conf>>): NMPlayer<Conf>;

	/**
	 * Merges partial options into the existing player configuration without reloading.
	 * Useful for updating settings like `accessToken` or `basePath` at runtime.
	 * @param options - The partial configuration to merge.
	 */
	setConfig<Conf>(options: Partial<Conf & PlayerConfig<any>>): void;

	/**
	 * Destroys the player instance and cleans up all resources.
	 * Removes event listeners, detaches HLS, disconnects the gain node,
	 * removes DOM elements, and emits a `'dispose'` event.
	 */
	dispose(): void;
}
