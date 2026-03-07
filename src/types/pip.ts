export interface PipConfig {
	enabled: boolean;
	trigger?: 'manual' | 'tab-hidden' | 'float';
}

export interface NMPlayerPip {
	/**
	 * Returns whether the player is currently in Picture-in-Picture mode.
	 * @returns `true` if in PIP.
	 */
	pip(): boolean;
	/**
	 * Enters or exits Picture-in-Picture mode.
	 * @param value - `true` to enter PIP, `false` to exit.
	 */
	pip(value: boolean): void;
}
