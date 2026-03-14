import type Plugin from '../plugins/plugin';
import type { PlayerConfig } from './config';
import type { NMPlayer } from './player';

/**
 * Plugin registry interface for typed plugin access.
 * Consumers can extend this via declaration merging to register custom plugins:
 *
 * @example
 * ```ts
 * declare module '@nomercy-entertainment/nomercy-video-player' {
 *   interface PluginRegistry {
 *     myPlugin: MyPlugin;
 *   }
 * }
 * ```
 *
 * Then `player.plugins.get('myPlugin')` returns `MyPlugin | undefined`.
 */
export interface PluginRegistry {}

/** Typed Map that uses PluginRegistry for known keys, falls back to Plugin for unknown keys. */
export interface PluginMap extends Map<string, Plugin> {
	get<K extends keyof PluginRegistry>(key: K): PluginRegistry[K] | undefined;
	get(key: string): Plugin | undefined;
	set<K extends keyof PluginRegistry>(key: K, value: PluginRegistry[K]): this;
	set(key: string, value: Plugin): this;
	has(key: keyof PluginRegistry | string): boolean;
	delete(key: keyof PluginRegistry | string): boolean;
}

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
	 * Resolves the current access token.
	 * If a getter function was provided, it is called to retrieve the latest value.
	 * @returns The current access token string, or `undefined` if not set.
	 */
	getAccessToken(): string | undefined;

	/**
	 * Updates the access token at runtime.
	 * Accepts a static string or a getter function that is called on each request,
	 * allowing automatic token refresh without re-initializing the player.
	 * @param accessToken - A token string or a function that returns one.
	 */
	setAccessToken(accessToken: string | (() => string)): void;

	/**
	 * Destroys the player instance and cleans up all resources.
	 * Removes event listeners, detaches HLS, disconnects the gain node,
	 * removes DOM elements, and emits a `'dispose'` event.
	 */
	dispose(): void;
}
