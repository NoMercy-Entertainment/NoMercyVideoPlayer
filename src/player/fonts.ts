import type { NMPlayer, Track } from '../types';

export const fontMethods = {
	/**
	 * Fetches the font file and updates the fonts array if the file has changed.
	 * @returns {Promise<void>} A Promise that resolves when the font file has been fetched and the fonts array has been updated.
	 */
	async fetchFontFile(this: NMPlayer): Promise<void> {
		const file = this.fontsFile();
		if (file && this.currentFontFile !== file) {
			this.currentFontFile = file;

			await this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					try {
						this.fonts = JSON.parse(data).map((f: { file: string; mimeType: string }) => {
							const baseFolder = file.replace(/\/[^/]*$/u, '');
							return {
								...f,
								file: `${baseFolder}/${f.file}`,
							};
						});
					}
					catch (e) {
						this.logger.error('Font file parse failed', { error: String(e) });
						this.fonts = [];
					}

					this.emit('fonts', this.fonts);
				},
			});
		}
	},

	/**
	 * Returns the file associated with the 'fonts' metadata item of the current playlist item, if it exists.
	 * @returns {string | undefined} The file associated with the 'fonts' metadata item
	 * of the current playlist item, or undefined if it does not exist.
	 */
	fontsFile(this: NMPlayer): string | undefined {
		return this.playlistItem()?.tracks?.find((t: Track) => t.kind === 'fonts')?.file;
	},
};
