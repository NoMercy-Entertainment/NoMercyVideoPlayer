export interface NMPlayerVolume {
	/**
	 * Returns the current volume level as an integer from 0 to 100.
	 * @returns The current volume (0–100).
	 */
	volume(): number;
	/**
	 * Sets the volume level. Values are clamped to the 0–100 range.
	 * Automatically unmutes the player and persists the value to storage.
	 * @param value - The volume level to set (0–100).
	 */
	volume(value: number): void;

	/**
	 * Returns whether the player is currently muted.
	 * @returns `true` if the player is muted.
	 */
	muted(): boolean;
	/**
	 * Sets the muted state of the player.
	 * @param value - `true` to mute, `false` to unmute.
	 */
	muted(value: boolean): void;

	/**
	 * Toggles the muted state of the player.
	 * Persists the muted state to storage and displays a message overlay
	 * showing either "Muted" or the current volume percentage.
	 */
	toggleMute(): void;

	/**
	 * Increases the volume by 10 units, up to a maximum of 100.
	 * Displays a message overlay showing the new volume percentage.
	 */
	volumeUp(): void;

	/**
	 * Decreases the volume by 10 units. If the volume is already at 0, the player is muted.
	 * Unmutes the player if it was muted and the volume is above 0.
	 * Displays a message overlay showing the new volume percentage.
	 */
	volumeDown(): void;

	/**
	 * Returns the current gain node settings including min, max, default, and current value.
	 * @returns The gain state object.
	 * @throws {Error} If no gain node has been created (call `addGainNode()` first).
	 */
	gain(): { min: number; max: number; defaultValue: number; value: number } | undefined;
	/**
	 * Sets the gain node value for volume amplification and emits a `'gain'` event.
	 * @param value - The gain multiplier to set (e.g. `1` for normal, `2` for double).
	 */
	gain(value: number): void;
}
