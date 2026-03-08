import type { NMPlayer } from '../types';

/**
 * Maps non-standard language codes (used in some media container formats)
 * to their BCP-47 equivalents, which `Intl.DisplayNames` would not otherwise recognise.
 * Standard ISO 639-2/B bibliographic codes (fre, ger, chi, …) are handled
 * natively by the runtime and do not need to be listed here.
 */
const iso3ToBcp47: Readonly<Record<string, string>> = {
	bra: 'pt-BR', // informal shorthand for Brazilian Portuguese
	pob: 'pt-BR', // alternative informal shorthand for Brazilian Portuguese
};

/**
 * Looks up a language display name via `Intl.DisplayNames`.
 * Accepts both ISO 639-3 bibliographic codes (mapped to BCP-47) and
 * already-valid BCP-47 subtags. Returns null if the runtime cannot resolve it.
 */
function intlLanguageName(code: string, locale: string): string | null {
	const bcp47 = iso3ToBcp47[code] ?? code;
	try {
		const name = new Intl.DisplayNames([locale, 'en'], { type: 'language', fallback: 'none' }).of(bcp47);
		// Reject if Intl just echoed the tag back unchanged (unrecognised code)
		return (name && name !== bcp47 && name !== code) ? name : null;
	}
	catch {
		return null;
	}
}

/** Available built-in locale files. Used to resolve the correct file without 404s. */
const availableLocales: readonly string[] = [
	'af',
	'ar',
	'bg',
	'bn',
	'ca',
	'cs',
	'cy',
	'da',
	'de',
	'el',
	'en',
	'es',
	'et',
	'eu',
	'fa',
	'fi',
	'fr',
	'ga',
	'gl',
	'gu',
	'he',
	'hi',
	'hr',
	'hu',
	'hy',
	'id',
	'is',
	'it',
	'ja',
	'ka',
	'kk',
	'km',
	'kn',
	'ko',
	'ku',
	'ky',
	'lo',
	'lt',
	'lv',
	'mk',
	'ml',
	'mn',
	'mr',
	'ms',
	'my',
	'nb',
	'ne',
	'nl',
	'nn',
	'no',
	'oc',
	'pa',
	'pl',
	'pt',
	'pt-BR',
	'ro',
	'ru',
	'si',
	'sk',
	'sl',
	'sq',
	'sr',
	'sv',
	'sw',
	'ta',
	'te',
	'tg',
	'th',
	'tl',
	'tr',
	'uk',
	'ur',
	'uz',
	'vi',
	'xh',
	'yo',
	'zh',
	'zh-TW',
	'zu',
];

/**
 * Resolves a locale tag to the best available locale file.
 * Exact match → base language → 'en'.
 */
export function resolveLocale(language: string): string {
	if (availableLocales.includes(language))
		return language;
	const base = language.split('-')[0];
	if (availableLocales.includes(base))
		return base;
	return 'en';
}

export const translationMethods = {
	/**
	 * Fetches translation files for the resolved language.
	 * 1. Resolves the locale to an available file (no fallback requests, no 404s).
	 * 2. Loads the built-in locale JSON (language codes + core player strings).
	 * 3a. If `options.translations` is a string[], treats each entry as a URL pattern,
	 *     replacing `{lang}` with the resolved locale and fetching the file.
	 * 3b. If `options.translations` is a `Record<string, string>`, merges it directly.
	 * Emits `'translations'` per file with `{ source, data }` and a final `'translationsLoaded'`.
	 */
	async fetchTranslationsFile(this: NMPlayer): Promise<void> {
		const language = this.options.language ?? navigator.language;
		const resolved = resolveLocale(language);
		const baseUrl = 'https://raw.githubusercontent.com/NoMercy-Entertainment/NoMercyVideoPlayer/refs/heads/master/public/locales';

		const loadedFiles: string[] = [];

		// 1. Load built-in locale file (single fetch, guaranteed to exist)
		const builtInUrl = `${baseUrl}/${resolved}.json`;
		const builtInLoaded = await this._tryFetchTranslation(builtInUrl);
		if (builtInLoaded) {
			loadedFiles.push(builtInLoaded);
		}

		// 2. Load each custom translation file or inline record from config
		if (Array.isArray(this.options.translations) && this.options.translations.length) {
			for (const pattern of this.options.translations) {
				const url = pattern.replace('{lang}', resolved);
				const loaded = await this._tryFetchTranslation(url);
				if (loaded) {
					loadedFiles.push(loaded);
				}
			}
		}
		else if (this.options.translations && !Array.isArray(this.options.translations)) {
			this.translations = { ...this.translations, ...this.options.translations };
			this.emit('translations', { source: 'config', data: this.options.translations });
			loadedFiles.push('config');
		}

		if (loadedFiles.length === 0) {
			this.logger.warn('No translations file found, using key passthrough');
		}

		this.emit('translationsLoaded', { language: resolved, files: loadedFiles });
	},

	/**
	 * Fetches a single translation file and merges it into `this.translations`.
	 * Emits `'translations'` with source info on success.
	 * @returns The URL on success, or null on failure.
	 */
	async _tryFetchTranslation(this: NMPlayer, url: string): Promise<string | null> {
		try {
			await this.getFileContents<string>({
				url,
				options: {},
				callback: (data) => {
					const parsed: Record<string, string> = JSON.parse(data);
					this.translations = { ...this.translations, ...parsed };
					this.emit('translations', { source: url, data: parsed });
				},
			});
			return url;
		}
		catch {
			this.logger.debug(`Translations not found at ${url}`);
		}
		return null;
	},

	/**
	 * Returns the localized string for the given value, if available.
	 * Resolution order:
	 * 1. Loaded translations (from locale JSON + custom files/record)
	 * 2. Default translations
	 * 3. `Intl.DisplayNames` — for ISO 639-3 / BCP-47 language codes,
	 *    resolved against the player's current language setting
	 * 4. The original value as-is (pass-through)
	 * @param value - The string value to be localized.
	 * @returns The localized string, if available. Otherwise, the original value.
	 */
	localize(this: NMPlayer, value: string): string {
		if (this.translations?.[value]) {
			return this.translations[value];
		}

		if (this.defaultTranslations?.[value]) {
			return this.defaultTranslations[value];
		}

		const locale = this.options.language ?? navigator.language;
		const intl = intlLanguageName(value, locale);
		if (intl) {
			return intl;
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

	addTranslations(this: NMPlayer, translations: Record<string, string> | { key: string; value: string }[]): void {
		if (!this.translations) {
			this.translations = {};
		}

		if (Array.isArray(translations)) {
			translations.forEach((translation) => {
				this.translations[translation.key] = translation.value;
			});
		}
		else {
			Object.assign(this.translations, translations);
		}
	},
};
