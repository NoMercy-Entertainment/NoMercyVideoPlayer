import type { Cue } from 'webvtt-parser';
import type { Chapter } from './data';

export interface NMPlayerChapters {
	/**
	 * Returns an array of chapter objects, each containing information about the chapter's
	 * ID, title, start and end times, and position within the video as percentages.
	 * @returns An array of chapter objects with `id`, `title`, `startTime`, `endTime`, `left`, and `width`.
	 */
	chapters(): Chapter[];

	/**
	 * Returns the chapter that is active at the given time position.
	 * @param currentTime - The time in seconds to check.
	 * @returns The chapter cue at that time, or `undefined` if no chapter is active.
	 */
	chapter(currentTime: number): Cue | undefined;

	/**
	 * Fetches the chapter metadata file and parses it using the WebVTT parser.
	 * Emits a `'chapters'` event when parsing is complete.
	 */
	fetchChapterFile(): void;

	/**
	 * Seeks to the start of the current chapter, or to the previous chapter if the current
	 * playback position is within 10 seconds of the current chapter's start time.
	 */
	previousChapter(): void;

	/**
	 * Seeks to the start of the next chapter.
	 * Does nothing if there is no next chapter.
	 */
	nextChapter(): void;

	/**
	 * Returns the last chapter whose end time is at or before the given time.
	 * This is the chapter immediately preceding the given time position.
	 * @param currentStartTime - The reference time in seconds.
	 * @returns The previous chapter cue, or `undefined` if none exists.
	 */
	previousChapterAt(currentStartTime: number): Cue | undefined;

	/**
	 * Returns the chapter whose start time is at or after the given end time.
	 * Useful for navigating to the next chapter.
	 * @param currentEndTime - The reference time in seconds.
	 * @returns The next chapter cue, or `undefined` if none exists.
	 */
	nextChapterAt(currentEndTime: number): Cue | undefined;

	/**
	 * Returns the chapter metadata file URL from the current playlist item's tracks.
	 * Looks for a track with `kind: 'chapters'`.
	 * @returns The chapter file URL, or `undefined` if no chapter track exists.
	 */
	chapterFile(): string | undefined;

	/**
	 * Returns the title of the chapter at the given scrub/seek time.
	 * Finds the last chapter whose start time is before the given time.
	 * @param scrubTimePlayer - The time position in seconds.
	 * @returns The chapter title, or `null` if no chapters are available.
	 */
	chapterText(scrubTimePlayer: number): string | null;
}
