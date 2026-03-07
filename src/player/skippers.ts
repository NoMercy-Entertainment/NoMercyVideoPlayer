import type { NMPlayer, Skipper, Track, VTTData } from '../types';
import { WebVTTParser } from 'webvtt-parser';

export const skipperMethods = {
	/**
	 * Returns an array of skip objects, each containing information about the skip's ID, title, start and end times, and position within the video.
	 * @returns An array of skip segment objects.
	 */
	skippers(this: NMPlayer): Skipper[] {
		return this._skippers?.cues?.map((skip: {
			id: string;
			text: string;
			startTime: number;
			endTime: number;
		}, index: number): Skipper => ({
			id: `Skip ${index}`,
			title: skip.text,
			startTime: skip.startTime,
			endTime: skip.endTime,
			type: skip.text.trim(),
		})) ?? [];
	},

	/**
	 * Returns the current skip based on the current time.
	 * @returns The current skip object or undefined if no skip is found.
	 */
	skip(this: NMPlayer): Skipper | undefined {
		return this.skippers().find((skipper) => {
			return this.currentTime() >= skipper.startTime && this.currentTime() <= skipper.endTime;
		});
	},

	/**
	 * Fetches the skip file and parses it to get the skippers.
	 * Emits the 'skippers' event with the parsed skippers.
	 * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'skippers' event.
	 */
	fetchSkipFile(this: NMPlayer) {
		this._skippers = <VTTData>{};
		const file = this.skipFile();
		if (file && this.currentSkipFile !== file) {
			this.currentSkipFile = file;
			this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					const parser = new WebVTTParser();
					this._skippers = parser.parse(data, 'metadata');

					if (this.duration()) {
						this.emit('skippers', this.skippers());
					}
					else {
						this.once('duration', () => {
							this.emit('skippers', this.skippers());
						});
					}
				},
			}).catch(() => {});
		}
	},

	/**
	 * Returns the file associated with the skip metadata of the current playlist item, if any.
	 * @returns The skip file, or undefined if no skip metadata is found.
	 */
	skipFile(this: NMPlayer): string | undefined {
		return this.playlistItem()?.tracks?.find((t: Track) => t.kind === 'skippers')?.file;
	},
};
