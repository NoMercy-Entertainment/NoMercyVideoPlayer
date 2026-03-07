export interface FloatConfig {
	enabled: boolean;
	dismissible?: boolean;
}

export interface NMPlayerFloat {
	/**
	 * Returns whether the player is currently in floating (mini-player) mode.
	 * @returns `true` if floating.
	 */
	float(): boolean;
	/**
	 * Enters or exits floating mode.
	 * @param value - `true` to enter floating mode, `false` to exit.
	 */
	float(value: boolean): void;
}
