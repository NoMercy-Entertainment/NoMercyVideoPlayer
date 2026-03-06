import type { AudioTrack } from './data';

export interface NMPlayerAudio {
	/**
	 * Returns the currently active audio track from the HLS instance.
	 * @returns The active audio track, or `null` if HLS is not available.
	 */
	audioTrack(): AudioTrack | null;
	/**
	 * Switches to the audio track at the given index and persists the language to storage.
	 * @param index - The audio track index to activate.
	 */
	audioTrack(index: number): void;

	/**
	 * Returns the list of available audio tracks from the HLS instance.
	 * Each track includes `id`, `language`, and `label` properties.
	 * @returns An array of audio tracks, or an empty array if HLS is not available.
	 */
	audioTracks(): AudioTrack[];

	/**
	 * Returns the index of the currently active audio track.
	 * @returns The audio track index, or `-1` if HLS is not available.
	 */
	audioTrackIndex(): number;

	/**
	 * Returns whether the player has multiple audio tracks available.
	 * @returns `true` if there are more than one audio track.
	 */
	hasAudioTracks(): boolean;

	/**
	 * Cycles to the next audio track in the list.
	 * Wraps around to the first track after the last one.
	 * Does nothing if there are fewer than 2 audio tracks.
	 * Displays a message overlay with the new audio track name.
	 */
	cycleAudioTracks(): void;

	/**
	 * Returns the index of the audio track that matches the given language code.
	 * @param language - The language code to search for (e.g. `'eng'`, `'jpn'`).
	 * @returns The zero-based index of the matching track, or `-1` if not found.
	 */
	audioTrackIndexByLanguage(language: string): number;

	/**
	 * Restores the audio track from storage based on the previously saved language preference.
	 */
	setCurrentAudioTrackFromStorage(): void;
}
