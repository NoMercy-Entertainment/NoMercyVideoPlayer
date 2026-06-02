import type { SubtitleStyle } from '@nomercy-entertainment/nomercy-player-core';

/**
 * Contract for anything that can persist and restore the user's subtitle
 * style preferences across sessions.
 *
 * The player does NOT wire this in: `player.subtitleStyle()` keeps style in
 * memory and emits the `subtitleStyle` event. A consumer that wants
 * persistence wires a store itself — calling `load()` after `ready()` and
 * applying the result via `player.subtitleStyle(style)`, and `save(style)`
 * from a `subtitleStyle` listener. `StorageBackedSubtitleStyleStore` is a
 * ready-made implementation backed by the kit's `IStorage` adapter.
 */
export interface ISubtitleStyleStore {
	/**
	 * Load and return the persisted subtitle style, or `null` when no
	 * preference has been saved yet. The consumer applies the returned style
	 * via `player.subtitleStyle(style)` after `ready()`.
	 */
	load(): Promise<Partial<SubtitleStyle> | null>;

	/**
	 * Persist `style` so it survives page reloads. The consumer calls this
	 * from a `subtitleStyle` event listener with the full merged style.
	 */
	save(style: SubtitleStyle): Promise<void>;

	/** Clear any persisted preference (e.g. "reset to defaults" action). */
	clear(): Promise<void>;
}
