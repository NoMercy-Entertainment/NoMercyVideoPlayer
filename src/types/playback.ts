export interface NMPlayerPlayback {
	/**
	 * Starts or resumes video playback. Sets `autoPlay` to `true` and updates the Media Session state.
	 * @returns A promise that resolves when playback has started.
	 */
	play(): Promise<void>;

	/**
	 * Pauses video playback and updates the Media Session state.
	 */
	pause(): void;

	/**
	 * Pauses the video, resets playback to the beginning, and sets the Media Session state to `'none'`.
	 */
	stop(): void;

	/**
	 * Toggles between play and pause. If the video is paused, it starts playback; if playing, it pauses.
	 */
	togglePlayback(): void;

	/**
	 * Seeks to the beginning of the video and starts playback.
	 */
	restart(): void;

	/**
	 * Seeks to the given position in seconds.
	 * Returns the current time if the value is not finite.
	 * Emits `'seek'` immediately and `'seeked'` after a short delay.
	 * @param position - The target position in seconds.
	 * @returns The position that was seeked to.
	 */
	seek(position: number): number;

	/**
	 * Seeks to a position calculated as a percentage (0–100) of the total video duration.
	 * @param arg - The target percentage (0–100).
	 * @returns The calculated position in seconds.
	 */
	seekByPercentage(arg: number): number;

	/**
	 * Rewinds the video by the specified number of seconds.
	 * Multiple rapid calls accumulate the rewind amount until a debounce timeout.
	 * Emits `'rewind'` with the accumulated time, then seeks when the debounce completes.
	 * @param seconds - The number of seconds to rewind. Defaults to the configured `seekInterval` or 10.
	 */
	rewind(seconds?: number): void;

	/**
	 * Forwards the video by the specified number of seconds.
	 * Multiple rapid calls accumulate the forward amount until a debounce timeout.
	 * Emits `'forward'` with the accumulated time, then seeks when the debounce completes.
	 * @param seconds - The number of seconds to forward. Defaults to the configured `seekInterval` or 10.
	 */
	forward(seconds?: number): void;

	/**
	 * Returns the current playback speed multiplier.
	 * @returns The current playback rate (e.g. `1` for normal, `2` for double speed).
	 */
	speed(): number;
	/**
	 * Sets the playback speed and emits a `'speed'` event.
	 * @param value - The playback rate to set (e.g. `0.5`, `1`, `1.5`, `2`).
	 */
	speed(value: number): void;

	/**
	 * Returns an array of available playback speed options as configured in `playbackRates`.
	 * @returns An array of speed multipliers (e.g. `[0.5, 1, 1.5, 2]`).
	 */
	speeds(): number[];

	/**
	 * Returns whether multiple playback speed options are configured.
	 * @returns `true` if `playbackRates` contains more than one speed.
	 */
	hasSpeeds(): boolean;
}
