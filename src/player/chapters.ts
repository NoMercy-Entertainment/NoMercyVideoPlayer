import type { Chapter, NMPlayer, Track } from '../types';
import type { Cue } from 'webvtt-parser';
import { WebVTTParser } from 'webvtt-parser';

export const chapterMethods = {
	/**
	 * Returns an array of chapter objects, each containing information about the chapter's ID, title, start and end times, and position within the video.
	 * @returns {Array} An array of chapter objects.
	 */
	chapters(this: NMPlayer): Chapter[] {
		return this._chapters?.cues
			?.map((chapter: { id: any; text: any; startTime: any }, index: number): Chapter => {
				const endTime = this._chapters?.cues[index + 1]?.startTime ?? this.duration();
				return {
					id: `Chapter ${index}`,
					title: chapter.text,
					left: chapter.startTime / this.duration() * 100,
					width: (endTime - chapter.startTime) / this.duration() * 100,
					startTime: chapter.startTime,
					endTime,
					time: 0,
				};
			}) ?? [];
	},

	/**
	 * Returns the current chapter based on the current time.
	 * @returns The current chapter object or undefined if no chapter is found.
	 */
	chapter(this: NMPlayer, currentTime: number): Cue | undefined {
		return this._chapters.cues.find(chapter => currentTime >= chapter.startTime && currentTime <= chapter.endTime);
	},

	/**
	 * Fetches the chapter file and parses it to get the chapters.
	 * Emits the 'chapters' event with the parsed chapters.
	 * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'chapters' event.
	 */
	fetchChapterFile(this: NMPlayer): void {
		const file = this.chapterFile();
		if (file && this.currentChapterFile !== file) {
			this.currentChapterFile = file;
			this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					const parser = new WebVTTParser();
					this._chapters = parser.parse(data, 'chapters');

					this.once('duration', () => {
						this.emit('chapters', this._chapters);
					});
				},
			}).catch(() => {});
		}
	},

	previousChapter(this: NMPlayer): void {
		const currentChapter = this.chapter(this.currentTime());
		if (!currentChapter)
			return;

		if (this.currentTime() - currentChapter.startTime > 10) {
			this.seek(currentChapter.startTime);
			return;
		}

		const previousChapter = this.previousChapterAt(this.currentTime());
		if (!previousChapter)
			return;

		this.seek(previousChapter.startTime);
	},

	nextChapter(this: NMPlayer): void {
		const nextChapter = this.nextChapterAt(this.currentTime());
		if (!nextChapter)
			return;

		this.seek(nextChapter.startTime);
	},

	previousChapterAt(this: NMPlayer, currentStartTime: number): Cue | undefined {
		return this._chapters.cues.filter(chapter => chapter.endTime <= currentStartTime).at(-1);
	},

	nextChapterAt(this: NMPlayer, currentEndTime: number): Cue | undefined {
		return this._chapters.cues.find(chapter => chapter.startTime >= currentEndTime);
	},

	/**
	 * Returns the file associated with the chapter metadata of the current playlist item, if any.
	 * @returns The chapter file, or undefined if no chapter metadata is found.
	 */
	chapterFile(this: NMPlayer): string | undefined {
		return this.playlistItem().tracks?.find((t: Track) => t.kind === 'chapters')?.file;
	},

	chapterText(this: NMPlayer, scrubTimePlayer: number): string | null {
		const chapters = this.chapters();
		if (chapters.length === 0)
			return null;

		const index = chapters.findIndex(chapter => chapter.startTime > scrubTimePlayer);

		return chapters[index - 1]?.title
			?? chapters[chapters.length - 1]?.title
			?? null;
	},
};
