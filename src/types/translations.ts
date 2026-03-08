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
	 * @param translations - A Record or an array of `{ key, value }` objects.
	 */
	addTranslations(translations: Record<string, string> | { key: string; value: string }[]): void;

	/**
	 * Fetches translation files for the resolved language.
	 * Loads the built-in locale JSON, then either fetches URL patterns from
	 * `options.translations` (string[]) or merges an inline record (Record<string, string>).
	 * @returns A promise that resolves when all translations have been loaded.
	 */
	fetchTranslationsFile(): Promise<void>;

	/**
	 * Fetches a single translation file and merges it into translations.
	 * @internal
	 */
	_tryFetchTranslation(url: string): Promise<string | null>;

	/**
	 * Sets the title of the document.
	 * @param value - The new title to set.
	 */
	setTitle(value: string): void;
}
