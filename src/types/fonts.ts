export interface NMPlayerFonts {
	/**
	 * Fetches the font file and updates the fonts array if the file has changed.
	 * Parses the JSON font list and resolves relative paths against the font file's base folder.
	 * Emits a `'fonts'` event with the updated fonts array.
	 * @returns A Promise that resolves when the font file has been fetched and the fonts array has been updated.
	 */
	fetchFontFile(): Promise<void>;

	/**
	 * Returns the fonts metadata file URL from the current playlist item's tracks.
	 * Looks for a track with `kind: 'fonts'`.
	 * @returns The fonts file URL, or `undefined` if no fonts track exists.
	 */
	fontsFile(): string | undefined;
}
