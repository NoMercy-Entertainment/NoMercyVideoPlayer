export interface NMPlayerTranslations {
	/**
	 * Returns the localized string for the given value.
	 * Checks the loaded translations first, then falls back to default translations,
	 * and finally returns the original value if no translation is found.
	 * @param value - The string key to localize.
	 * @returns The localized string, or the original value.
	 */
	localize(value: string): string;

	/**
	 * Adds a single translation key-value pair to the translations dictionary.
	 * Creates the dictionary if it doesn't exist yet.
	 * @param key - The translation key.
	 * @param value - The translated string.
	 */
	addTranslation(key: string, value: string): void;

	/**
	 * Adds multiple translation key-value pairs to the translations dictionary.
	 * @param translations - An array of `{ key, value }` objects.
	 */
	addTranslations(translations: { key: string; value: string }[]): void;

	/**
	 * Fetches the translations file using the `language` option (falling back to `navigator.language`).
	 * Loads from the GitHub-hosted locale JSON and emits a `'translations'` event.
	 * @returns A promise that resolves when the translations have been loaded.
	 */
	fetchTranslationsFile(): Promise<void>;

	/**
	 * Sets the title of the document.
	 * @param value - The new title to set.
	 */
	setTitle(value: string): void;
}
