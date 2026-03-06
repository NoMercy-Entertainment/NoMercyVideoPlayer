import type { Skipper } from './data';

export interface NMPlayerSkippers {
	/**
	 * Returns an array of skip/intro/outro segment objects parsed from the skip metadata file.
	 * Each segment includes `id`, `title`, `startTime`, `endTime`, and `type`.
	 * @returns An array of skip segment objects.
	 */
	skippers(): Skipper[];

	/**
	 * Returns the skip segment (intro/outro) that is active at the current playback time.
	 * @returns The current skip object, or `undefined` if no skip is active.
	 */
	skip(): Skipper | undefined;

	/**
	 * Fetches the skip file and parses it using the WebVTT parser.
	 * Emits the `'skippers'` event with the parsed skippers.
	 * If the video duration is not available yet, waits for the `'duration'` event before emitting.
	 */
	fetchSkipFile(): void;

	/**
	 * Returns the skip/intro/outro metadata file URL from the current playlist item's tracks.
	 * Looks for a track with `kind: 'skippers'`.
	 * @returns The skip file URL, or `undefined` if no skip track exists.
	 */
	skipFile(): string | undefined;
}
