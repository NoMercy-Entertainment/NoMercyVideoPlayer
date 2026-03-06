import type { SubtitleStyle, SubtitleTrack } from './data';

export interface NMPlayerSubtitles {
	/**
	 * Returns the currently active subtitle track, or a default "Off" track if none is selected.
	 * Always returns a SubtitleTrack object — never `undefined`.
	 * @returns The active subtitle track, or a default "Off" track with `id: -1`.
	 */
	subtitle(): SubtitleTrack | undefined;
	/**
	 * Switches to the subtitle track at the given index. Pass `0` to disable subtitles (selects the "Off" entry).
	 * Clears the current subtitle display, emits `'captionsChanged'`, and persists the choice to storage.
	 * @param index - The subtitle track index to activate.
	 */
	subtitle(index: number): void;

	/**
	 * Returns an array of subtitle tracks for the current playlist item.
	 * Includes an `"Off"` entry at index 0. Each track has `id`, `label`, `language`, `type`, `ext`, and `file`.
	 * @returns An array of subtitle tracks.
	 */
	subtitles(): SubtitleTrack[];

	/**
	 * Returns the index of the currently active subtitle track.
	 * @returns The subtitle track index.
	 */
	subtitleIndex(): number;

	/**
	 * Finds the index of a subtitle track matching the given language, type, and file extension.
	 * First checks by file suffix, then falls back to matching individual properties.
	 * @param language - The language code to match (e.g. `'eng'`).
	 * @param type - The subtitle type to match (e.g. `'full'`, `'sign'`).
	 * @param ext - The file extension to match (e.g. `'vtt'`, `'ass'`).
	 * @returns The matching subtitle index, or `undefined` if not found.
	 */
	subtitleIndexBy(language: string, type: string, ext: string): number | undefined;

	/**
	 * Returns whether subtitle tracks are available for the current playlist item.
	 * @returns `true` if there is at least one subtitle track (excluding the "Off" entry).
	 */
	hasSubtitles(): boolean;

	/**
	 * Cycles to the next subtitle track in the list.
	 * Wraps around to the first track (Off) after the last one.
	 * Does nothing if there are no subtitle tracks.
	 * Displays a message overlay with the new subtitle track name.
	 */
	cycleSubtitles(): void;

	/**
	 * Returns the current subtitle style configuration (font size, color, background, edge style, etc.).
	 * @returns The current subtitle style object.
	 */
	subtitleStyle(): SubtitleStyle;
	/**
	 * Merges the given partial style into the current subtitle style and re-applies it.
	 * Persists the updated style to storage and emits `'set-subtitle-style'` for each changed property.
	 * @param value - A partial subtitle style object with the properties to update.
	 */
	subtitleStyle(value: Partial<SubtitleStyle>): void;

	/**
	 * Fetches the subtitle file for the currently selected subtitle track and parses it.
	 * Handles both VTT and ASS/SSA subtitle formats.
	 */
	fetchSubtitleFile(): void;

	/**
	 * Checks if subtitles need to be updated based on the current playback time.
	 * Updates the subtitle overlay with the appropriate cue text.
	 */
	checkSubtitles(): void;

	/**
	 * Parses subtitle text and creates a DocumentFragment for rendering.
	 * Handles HTML tags and special formatting in subtitle cues.
	 * @param text - The raw subtitle cue text.
	 * @returns A DocumentFragment ready for insertion into the subtitle overlay.
	 */
	buildSubtitleFragment(text: string): DocumentFragment;

	/**
	 * Persists the current subtitle selection (language, type, extension) to storage.
	 * @returns A promise that resolves when the choice has been stored.
	 */
	storeSubtitleChoice(): Promise<void>;

	/**
	 * Restores the subtitle track from storage based on the previously saved selection.
	 * @returns A promise that resolves when the subtitle has been restored.
	 */
	setCurrentCaptionFromStorage(): Promise<void>;

	/**
	 * Returns the file URL of the currently active subtitle track.
	 * @returns The subtitle file URL, or `undefined` if no subtitle is selected.
	 */
	subtitleFile(): string | undefined;
}
