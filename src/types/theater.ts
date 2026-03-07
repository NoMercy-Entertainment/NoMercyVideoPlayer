export interface TheaterConfig {
	enabled: boolean;
}

export interface NMPlayerTheater {
	/**
	 * Returns whether the player is currently in theater mode.
	 * @returns `true` if in theater mode.
	 */
	theater(): boolean;
	/**
	 * Enters or exits theater mode.
	 * @param value - `true` to enter theater mode, `false` to exit.
	 */
	theater(value: boolean): void;
}
