import type { NMPlayer } from '../types';

export const translationMethods = {
	/**
	 * Fetches the translations file for the specified language or the user's browser language.
	 * @returns A Promise that resolves when the translations file has been fetched and parsed.
	 */
	async fetchTranslationsFile(this: NMPlayer): Promise<void> {
		const language = this.options.language ?? navigator.language;
		const file = `https://raw.githubusercontent.com/NoMercy-Entertainment/NoMercyVideoPlayer/refs/heads/master/public/locales/${language}.json`;

		try {
			await this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					this.translations = JSON.parse(data);

					this.emit('translations', this.translations);
				},
			});
		}
		catch (error) {
			this.logger.error('Failed to fetch translations file', { error: String(error) });
		}
	},

	/**
	 * Returns the localized string for the given value, if available.
	 * If the value is not found in the translations, it returns the original value.
	 * @param value - The string value to be localized.
	 * @returns The localized string, if available. Otherwise, the original value.
	 */
	localize(this: NMPlayer, value: string): string {
		if (this.translations && this.translations[value as unknown as number]) {
			return this.translations[value as unknown as number];
		}

		if ((this.defaultTranslations as any) && (this.defaultTranslations as any)[value]) {
			return (this.defaultTranslations as any)[value];
		}

		return value;
	},

	/**
	 * Sets the title of the document.
	 * @param value - The new title to set.
	 */
	setTitle(this: NMPlayer, value: string): void {
		document.title = value;
	},

	addTranslation(this: NMPlayer, key: string, value: string): void {
		if (!this.translations) {
			this.translations = {};
		}

		this.translations[key] = value;
	},

	addTranslations(this: NMPlayer, translations: { key: string; value: string }[]): void {
		if (!this.translations) {
			this.translations = {};
		}

		translations.forEach((translation) => {
			this.translations[translation.key] = translation.value;
		});
	},
};
