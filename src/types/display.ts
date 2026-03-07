import type { PlayState, Stretching, TimeData } from './data';

export interface NMPlayerDisplay {
	/**
	 * Returns whether the player is currently in fullscreen mode.
	 * Checks if the `document.fullscreenElement` matches the player container.
	 * @returns `true` if the player is in fullscreen mode.
	 */
	fullscreen(): boolean;
	/**
	 * Enters or exits fullscreen mode.
	 * @param value - `true` to enter fullscreen, `false` to exit.
	 */
	fullscreen(value: boolean): void;

	/**
	 * Enters fullscreen mode for the player container.
	 * Requires a user activation gesture. Emits a `'fullscreen'` event on success.
	 * Displays an error message if fullscreen is not supported.
	 */
	enterFullscreen(): void;

	/**
	 * Exits fullscreen mode for the player.
	 */
	exitFullscreen(): void;

	/**
	 * Toggles fullscreen mode. If the player is currently in fullscreen, it exits;
	 * otherwise, it enters fullscreen mode.
	 */
	toggleFullscreen(): void;

	/**
	 * Returns the current aspect ratio mode (e.g. `'fill'`, `'uniform'`, `'exactfit'`, `'16:9'`, `'none'`).
	 * @returns The current aspect ratio as a string.
	 */
	aspect(): Stretching;
	/**
	 * Sets the aspect ratio mode and adjusts the video element's CSS `object-fit` accordingly.
	 * Displays a message overlay indicating the new aspect ratio.
	 * @param value - The aspect ratio mode to apply.
	 */
	aspect(value: Stretching): void;

	/**
	 * Cycles through the available aspect ratio options and applies the next one.
	 * Wraps around to the first option after the last one.
	 */
	cycleAspectRatio(): void;

	/**
	 * Enables or disables the fullscreen capability of the player.
	 * @param allowFullscreen - `true` to allow fullscreen, `false` to disable it.
	 */
	setAllowFullscreen(allowFullscreen: boolean): void;

	/**
	 * Recalculates the video element dimensions to fit the container while maintaining aspect ratio.
	 * Centers the video using absolute positioning and updates the subtitle overlay dimensions.
	 * Also updates the container's CSS `aspect-ratio` based on the video's native aspect ratio.
	 */
	resize(): void;

	/**
	 * Sets the container's CSS `aspect-ratio` based on the video's native aspect ratio.
	 * Maps to standard ratios: 4/3, 16/9, 21/9, or 32/9.
	 * @param videoAspectRatio - The video's width/height ratio.
	 */
	setResponsiveAspectRatio(videoAspectRatio: number): void;

	/**
	 * Returns the rendered width of the video element's bounding rectangle in pixels.
	 * @returns The width in pixels.
	 */
	width(): number;

	/**
	 * Returns the rendered height of the video element's bounding rectangle in pixels.
	 * @returns The height in pixels.
	 */
	height(): number;

	/**
	 * Returns the player's root `<div>` container element.
	 * This is the element that was passed to `setup()` or created by the player.
	 * @returns The container HTMLDivElement.
	 */
	element(): HTMLDivElement;

	/**
	 * Returns the current play state based on the video element's readyState and paused properties.
	 * @returns `"buffering"` if loading, `"paused"` if paused, `"playing"` if playing, or `"idle"`.
	 */
	state(): PlayState;

	/**
	 * Returns the current playback position in seconds.
	 * @returns The current time of the video element.
	 */
	currentTime(): number;

	/**
	 * Returns the total duration of the current video in seconds.
	 * May return `NaN` or `Infinity` if the duration is not yet available.
	 * @returns The duration of the video element.
	 */
	duration(): number;

	/**
	 * Returns the buffered time ranges of the current video.
	 * @returns A `TimeRanges` object representing the buffered portions.
	 */
	buffer(): TimeRanges;

	/**
	 * Returns the current video source URL from the active playlist item.
	 * @returns The file URL of the current playlist item.
	 */
	currentSrc(): string;

	/**
	 * Returns a comprehensive time data object with current time, duration, percentage,
	 * remaining time, human-readable strings, and the current playback rate.
	 * @returns The time data object.
	 */
	timeData(): TimeData;

	/**
	 * Returns whether a Picture-in-Picture event handler has been registered.
	 * @returns `true` if PIP is available.
	 */
	hasPIP(): boolean;

	/**
	 * Enables or disables the floating (mini-player) mode.
	 * Automatically disabled on mobile devices.
	 * @param shouldFloat - `true` to enable floating mode, `false` to disable.
	 */
	setFloatingPlayer(shouldFloat: boolean): void;

	/**
	 * Returns the thumbnail/preview time metadata file URL from the current playlist item's tracks.
	 * Looks for a track with `kind: 'thumbnails'`.
	 * @returns The time file URL, or `undefined` if no thumbnail track exists.
	 */
	timeFile(): string | undefined;

	/**
	 * Returns the sprite metadata file URL from the current playlist item's tracks.
	 * Looks for a track with `kind: 'sprite'`.
	 * @returns The sprite file URL, or `undefined` if no sprite track exists.
	 */
	spriteFile(): string | undefined;
}
