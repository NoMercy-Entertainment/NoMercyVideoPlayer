import type { Level } from './data';

export interface NMPlayerQuality {
	/**
	 * Returns the index of the currently active quality level from the HLS instance.
	 * @returns The current quality level index, or `-1` if HLS is not available.
	 */
	quality(): number;
	/**
	 * Sets the quality level by index. The change takes effect on the next segment load.
	 * Pass `-1` for automatic quality selection.
	 * @param index - The quality level index to activate.
	 */
	quality(index: number): void;

	/**
	 * Returns the available quality levels from the HLS instance.
	 * Includes an `"Auto"` entry at index `-1` and filters out HDR levels on non-HDR displays.
	 * @returns An array of quality levels.
	 */
	qualityLevels(): Level[];

	/**
	 * Returns whether the player has more than one quality level available.
	 * @returns `true` if there are multiple quality levels.
	 */
	hasQualities(): boolean;
}
